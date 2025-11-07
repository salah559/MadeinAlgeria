import { useState } from 'react';
import SearchFilter from '../SearchFilter';

export default function SearchFilterExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <SearchFilter
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedWilaya={selectedWilaya}
      onWilayaChange={setSelectedWilaya}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />
  );
}
