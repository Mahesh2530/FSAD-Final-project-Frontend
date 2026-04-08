// Helper function to format mock API response data with pagination
const formatPaginatedResponse = (data, page, size) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = data.slice(startIndex, endIndex);
  const totalElements = data.length;
  const totalPages = Math.ceil(totalElements / size);
  
  return {
    content: paginatedItems,
    page: page,
    size: size,
    total_elements: totalElements,
    total_pages: totalPages
  };
};
