import { useState, useEffect } from 'react';
import { IconLoader2 } from "@tabler/icons-react";
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
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (!chatbotId) {
      setSallaIntegration(null);
      setProducts([]);
      setHasMore(false);
      return;
    }

    const fetchSallaIntegration = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chatbot/integrations/salla?chatbotId=${chatbotId}`);
        if (!response.ok) {
          setSallaIntegration(null);
          setProducts([]);
          setHasMore(false);
          setLoading(false);
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
      setLoading(false);
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
        url.searchParams.append('per_page', perPage.toString());
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
          setProducts(data.data);
          // setProducts((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
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

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!sallaIntegration || !sallaIntegration.accessToken) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL('https://api.salla.dev/admin/v2/products');
        url.searchParams.append('per_page', perPage.toString());
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
          setProducts(data.data);
          setTotalPages(data.pagination?.totalPages || 1);
          setHasMore(page < (data.pagination?.totalPages || 1));
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  if (!sallaIntegration && !loading) {
    return <div>Salla isn't connected to this chatbot.</div>;
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
            <option key={category.id} value={category.name.toString()}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {
        loading && <div className='flex items-center justify-center h-[600px] overflow-y-auto'>
          <IconLoader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      }
      {
        !loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[600px] overflow-y-auto">
          {
            products.map((product) => (
              <a
                key={product.id}
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
            ))
          }
        </div>
      }
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {totalPages <= 7
          ? [...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`px-3 py-1 border rounded ${pageNum === page ? 'bg-blue-600 text-white' : ''
                  }`}
              >
                {pageNum}
              </button>
            );
          })
          : (() => {
            const pages = [];
            if (page <= 4) {
              for (let i = 1; i <= 5; i++) {
                pages.push(i);
              }
              pages.push('ellipsis');
              pages.push(totalPages);
            } else if (page >= totalPages - 3) {
              pages.push(1);
              pages.push('ellipsis');
              for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              pages.push(1);
              pages.push('ellipsis');
              pages.push(page - 1);
              pages.push(page);
              pages.push(page + 1);
              pages.push('ellipsis');
              pages.push(totalPages);
            }
            return pages.map((pageNum, idx) => {
              if (pageNum === 'ellipsis') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-3 py-1">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum as number)}
                  disabled={loading}
                  className={`px-3 py-1 border rounded ${pageNum === page ? 'bg-blue-600 text-white' : ''
                    }`}
                >
                  {pageNum}
                </button>
              );
            });
          })()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Salla;
