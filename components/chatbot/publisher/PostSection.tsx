import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Post } from "./types"; // Assuming you have a types file for Post type

export const PostSection = ({ title, posts }: { title: string; posts: Post[] }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className="mb-4 border rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="font-medium">{title} ({posts.length})</h3>
          {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </div>
        
        {expanded && (
          <div className="divide-y">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{post.title}</h4>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No posts available</div>
            )}
          </div>
        )}
      </div>
    );
  };