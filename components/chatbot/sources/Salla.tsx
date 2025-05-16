import { useState, useEffect } from 'react';

interface SallaProps {
  chatbotId: string;
}

interface Product {
  id: number;
  name: string;
  main_image: string;
  price: {
    amount: number;
    currency: string;
  };
  url: string;
}

interface Category {
  id: number;
  name: string;
}

const Salla = ({ chatbotId }: SallaProps) => {
  const [sallaIntegration, setSallaIntegration] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);

  useEffect(() => {
    if (!chatbotId) {
      setSallaIntegration(null);
      setProducts([]);
      setHasMore(false);
      return;
    }

    const fetchSallaIntegration = async () => {
      try {
        const response = await fetch(`/api/chatbot/integrations/salla?chatbotId=${chatbotId}`);
        if (!response.ok) {
          setSallaIntegration(null);
          setProducts([]);
          setHasMore(false);
          return;
        }
        const result = await response.json();
        setSallaIntegration(result.sallaIntegration || null);
        setProducts([]);
        setPage(1);
        setHasMore(true);
      } catch (error) {
        setSallaIntegration(null);
        setProducts([]);
        setHasMore(false);
      }
    };

    fetchSallaIntegration();
  }, [chatbotId]);

  // Fetch categories list from Salla API
  useEffect(() => {
    if (!sallaIntegration || !sallaIntegration.accessToken) {
      setCategories([]);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch('https://api.salla.dev/admin/v2/categories', {
          headers: {
            Authorization: `Bearer ${sallaIntegration.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setCategories([]);
          return;
        }
        const data = await res.json();
        if (data && data.data) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [sallaIntegration]);

  // Debounce search input to add bouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setPage(1); // Reset to first page on new search
      setProducts([]); // Clear products on new search
      setHasMore(true);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  useEffect(() => {
    if (!sallaIntegration || !sallaIntegration.accessToken) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL('https://api.salla.dev/admin/v2/products');
        url.searchParams.append('per_page', '10');
        url.searchParams.append('page', page.toString());
        if (debouncedSearch.trim() !== '') {
          url.searchParams.append('keyword', debouncedSearch.trim());
        }
        if (selectedCategory) {
          url.searchParams.append('category', selectedCategory);
        }

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${sallaIntegration.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setLoading(false);
          setHasMore(false);
          return;
        }
        const data = await res.json();
        if (data && data.data) {
          setProducts((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
          setHasMore(data.pagination && data.pagination.currentPage < data.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sallaIntegration, page, debouncedSearch, selectedCategory]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (!sallaIntegration) {
    return <div>Salla integration is not yet available.</div>;
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          className="flex-grow p-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
            setProducts([]);
            setHasMore(true);
          }}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={`salla-category-${category.id}`} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <a
            key={`sala-product-${product.id}`}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded p-4 hover:shadow-lg transition-shadow flex flex-col"
          >
            <img
              src={product.main_image}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="mt-auto font-semibold">
              {product.price.amount} {product.price.currency}
            </p>
          </a>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      {!hasMore && products.length > 0 && <p className="mt-4 text-center">No more products.</p>}
      {products.length === 0 && !loading && <p>No products found.</p>}
    </div>
  );
};

export default Salla;
