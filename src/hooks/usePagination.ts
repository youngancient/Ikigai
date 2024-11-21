import { useState, useMemo } from "react";
import { Activity } from "../types/activity";

export const usePagination = (items: Activity[], itemsPerPage: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);
  
    const paginatedItems = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);
  
    return {
      currentPage,
      setCurrentPage,
      totalPages,
      paginatedItems,
    };
  };
