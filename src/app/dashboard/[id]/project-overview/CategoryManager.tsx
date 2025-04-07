'use client';

import React, { useEffect, useState } from "react";
import { getProjectCategories, createProjectCategory, deleteProjectCategory } from "@/lib/api/categories";
import { ProjectCategory } from "@/lib/api/types";
import Button from "@/components/buttons/Button";
import { FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "next/navigation";

interface CategoryManagerProps {
  isManager: boolean;
}

const PAGE_SIZE = 3;

const CategoryManager: React.FC<CategoryManagerProps> = ({ isManager }) => {
  const params = useParams();
  const projectId = params.id as string;

  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getProjectCategories(projectId);
      setCategories(data);
      setPage(1);
    } catch (err) {
      setError("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [projectId]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createProjectCategory(projectId, newCategory.trim());
      setNewCategory("");
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProjectCategory(categoryId);
      fetchCategories();
    } catch (err: any) {
      setError("Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const paginatedCategories = categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Kategori Proyek</h2>
      {isManager && (
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
            type="text"
            placeholder="Tambah kategori baru"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            disabled={loading}
            maxLength={30}
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={loading || !newCategory.trim()}
            className="flex text-white items-center gap-2"
          >
            <FaPlus size={16} />
            Tambah
          </Button>
        </form>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="divide-y divide-gray-200">
        {paginatedCategories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center py-3 group">
            <span className="text-lg text-gray-700">{cat.name}</span>
            {isManager && (
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-500 hover:bg-red-50"
                disabled={loading}
                aria-label={`Hapus kategori ${cat.name}`}
              >
                <FaTrash />
              </Button>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="py-4 text-gray-400 text-center">Belum ada kategori.</li>
        )}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center mt-4 gap-2" aria-label="Pagination">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-white"
          >
            <FaChevronLeft/>
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={page === idx + 1 ? "primary" : "ghost"}
              size="small"
              onClick={() => setPage(idx + 1)}
              className={page === idx + 1 ? "text-white" : ""}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            variant="secondary"
            size="small"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="text-white"
          >
            <FaChevronRight/>
          </Button>
        </nav>
      )}
    </section>
  );
};

export default CategoryManager;
