# Profile Photo Handling

## Overview

Authentic stores user profile photos on Wasabi using the same secure, efficient infrastructure as content media. This document outlines the implementation for capturing, processing, storing, and serving profile photos during account creation and profile management.

## Key Design Principles

- **Consistency**: Use the established Wasabi architecture for all media including profile photos
- **Performance**: Generate and store optimized thumbnails for profile photos to improve load times
- **Security**: Use pre-signed URLs for secure client-side uploads directly to Wasabi
- **Resilience**: Implement robust error handling and fallbacks for profile photo operations
- **User Experience**: Provide intuitive upload and editing flows during account creation and profile management

## Storage Architecture

### Dedicated Path Structure

Unlike regular content media, profile photos use a dedicated path structure within the Wasabi bucket:

```
wasabi-bucket/
└── profile/{user-id}/
    ├── {timestamp}-{random-suffix}.jpg         # Original profile image (1024x1024)
    └── {timestamp}-{random-suffix}-thumbnail.jpg  # Profile thumbnail (256x256)
```

Where:
- `{user-id}` is the unique database ID of the user
- `{timestamp}` is a UNIX timestamp in milliseconds
- `{random-suffix}` is 8 random hexadecimal characters

This structure provides:
- Clear separation from regular post/moment content
- Easy identification of profile-related media
- Consistent management for all user-specific profile assets
- Simplified path generation and access control

### Database Integration

The `users` table includes two distinct URL fields for profile photos:

```sql
profile_photo_url VARCHAR(255),  -- URL to profile thumbnail (256x256) for quick loading
original_photo_url VARCHAR(255), -- URL to original high-resolution profile photo (1024x1024)
```

In the Prisma schema:
```prisma
model User {
  // Existing fields...
  profilePhotoUrl   String?  @map("profile_photo_url")  // 256x256 thumbnail
  originalPhotoUrl  String?  @map("original_photo_url") // 1024x1024 original
  // Other fields...
}
```

## Implementation Locations

The profile photo component is implemented in these priority scenarios:

1. **Post-Registration Onboarding** (Highest Priority):
   - After user account creation but during initial onboarding
   - User is already authenticated with a valid user ID
   - Allows skipping but encourages completion

2. **User Profile Page**:
   - Editable version when user is in edit mode
   - Display-only version when viewing normally

3. **Settings Page**:
   - Non-editable version for profile preview
   - Option to edit specifically via a dedicated control

4. **Navigation & UI Elements**:
   - Small (sm) non-editable versions for header/navigation
   - Consistent appearance across all locations

## Technical Implementation

### Image Processing Specifications

1. **Format Standards**:
   - All profile photos are stored as JPEG format
   - Original photos are stored at 1024×1024 pixels
   - Thumbnails are stored at 256×256 pixels
   - Both maintain a 1:1 aspect ratio

2. **Processing Steps**:
   - Automatic square cropping (from center)
   - EXIF metadata removal for privacy
   - Format conversion if needed (HEIC, PNG → JPEG)
   - High-quality compression (90% quality for originals, 80% for thumbnails)
   - Optional sharpening filter for thumbnails

3. **Size Limitations**:
   - Maximum input file size: 5MB
   - Target thumbnail size: 15-30KB
   - Target original size: 200-300KB

### API Endpoints

1. **Pre-signed URL Generation**:
   - Endpoint: `/api/media/profile-upload-urls`
   - Method: POST
   - Authentication: Required
   - Purpose: Generates secure, time-limited URLs for direct Wasabi uploads

2. **Profile Update**:
   - Endpoint: `/api/users/profile-photo`
   - Method: PUT
   - Authentication: Required
   - Purpose: Updates user record with new profile photo URLs after successful upload

### Upload Process Flow

1. User selects or captures profile photo
2. Client processes image (cropping, resizing, format conversion)
3. Client requests pre-signed URLs from API
4. Client uploads thumbnail first (for faster UI updates)
5. Client uploads original image
6. Client updates user record with new photo URLs
7. UI refreshes to display the new profile photo

## Profile Photo Update Lifecycle

To prevent UI flickering and inconsistent visual states during profile photo updates, follow this coordinated approach for handling the complete lifecycle of a profile photo change.

### Event Sequence and State Management

1. **Initiation Phase**
   - Set a single dedicated `PROFILE_PHOTO_UPDATE` loading key at the beginning of the process
   - Maintain old photo visibility until new photo is fully ready
   - Capture the previous photo URL for potential rollback

2. **Upload Phase**
   - Pre-validate image size/format client-side before upload begins
   - Generate and cache a local preview using `createObjectURL` for immediate feedback
   - Show upload progress indicator without changing actual profile display

3. **Transition Phase**
   - Preload new image before displaying it using an off-screen Image object
   - Implement optimistic UI updates after successful upload but before backend confirmation
   - Use atomic state updates to prevent partial UI refreshes

4. **Completion Phase**
   - Update all profile photo instances simultaneously using global state
   - Apply a subtle crossfade transition between old and new photos
   - Clear the `PROFILE_PHOTO_UPDATE` loading key only after all operations complete

### Implementation Pattern

```typescript
// Example pattern for coordinated profile photo update
async function updateProfilePhoto(file: File) {
  // Single loading key for entire operation
  loadingStore.setLoading('PROFILE_PHOTO_UPDATE', true);
  
  try {
    // Generate optimistic local preview
    const localPreview = URL.createObjectURL(file);
    
    // Preload image to avoid flickering
    await preloadImage(localPreview);
    
    // Update local state for immediate feedback
    userStore.updateLocalProfilePhoto(localPreview);
    
    // Perform actual upload
    const uploadResponse = await uploadProfilePhoto(file);
    
    // Preload final remote image
    await preloadImage(uploadResponse.photoUrl);
    
    // Update permanent state only after successful upload and preload
    userStore.setProfilePhoto(uploadResponse.photoUrl);
    
    // Cleanup local blob
    URL.revokeObjectURL(localPreview);
    
    return uploadResponse;
  } catch (error) {
    // Revert to previous photo on error
    userStore.revertProfilePhoto();
    throw error;
  } finally {
    // Clear loading state only at the very end
    loadingStore.setLoading('PROFILE_PHOTO_UPDATE', false);
  }
}

// Helper function to preload images
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
```

### Caching Considerations

- Use consistent cache keys for profile photos across components
- Implement cache busting with version parameters on URLs after updates
- Consider using stale-while-revalidate pattern for smoother transitions
- Use memory cache for transitional states and persistent cache for stable states

### UI Feedback Guidelines

- Maintain a visible loading indicator throughout the entire process
- Show upload progress when possible (especially for larger images)
- Provide clear error states with recovery options
- Use skeleton placeholders instead of empty spaces during loading

### Global State Integration

- Profile photo state should be centralized in a single source of truth
- Components should subscribe to this central state
- Use computed/derived values to transform the photo URL as needed
- Consider using React Context with a custom provider for photo-specific state

### Error Handling

- Implement graceful fallbacks to previous photo on error
- Provide clear user feedback on upload/processing failures
- Add automatic retry logic for transient network issues
- Log detailed errors for debugging while showing user-friendly messages

## Security Considerations

1. **Authentication**: All profile photo operations require authenticated sessions
2. **Authorization**: Users can only modify their own profile photos
3. **Validation**: Server-side validation ensures:
   - Only valid image types accepted (.jpg, .png, etc.)
   - File size limited (5MB max)
   - Image dimensions are reasonable
4. **Privacy**: EXIF data is stripped to protect user privacy
5. **URL Security**: Direct Wasabi URLs are not exposed; signed public URLs are used instead

## Component Architecture

The `UserProfilePhoto` component handles all aspects of displaying and editing profile photos:

### Props
- `editable`: Boolean to toggle edit functionality
- `size`: Parameter to control display size ("sm", "md", "lg", "xl" or pixel values)
- `className`: Optional for additional styling
- `onPhotoChange`: Optional callback to notify parent components of photo updates

### States
- `idle`: Default state showing current user's profile photo
- `selecting`: When photo selection interface is active
- `preview`: When showing selected photo before confirmation
- `uploading`: During Wasabi upload process
- `error`: When an error occurs during the process

## Error Handling

The system implements robust error handling for:

1. **Upload Failures**:
   - Network connectivity issues
   - File size or type validation errors
   - Server errors or timeouts
   - Authentication failures

2. **Processing Errors**:
   - Image format conversion issues
   - Memory limitations on client devices
   - Canvas API support issues

3. **Display Fallbacks**:
   - Default avatar shown when profile photo fails to load
   - Cached thumbnails used when originals unavailable
   - Graceful degradation for unsupported browsers

## Best Practices

1. **Size Consistency**: Use the predefined size parameters rather than custom dimensions
2. **Error Handling**: Always provide fallback UI for loading and error states
3. **Performance**: Use thumbnail URLs for any display under 256px
4. **Accessibility**: Ensure proper contrast for edit indicators and confirmation buttons
5. **Mobile Considerations**: Ensure touch targets are at least 44x44px for edit actions

## Future Enhancements

Planned for future iterations:

1. **Advanced Image Editing**: Add filters, basic editing tools
2. **Improved Cropping**: Interactive crop tool with zoom capabilities
3. **Animated Avatars**: Support for GIF profile photos
4. **Face Detection**: Smart cropping focused on faces
5. **Backup Recovery**: System for recovering accidentally deleted photos 