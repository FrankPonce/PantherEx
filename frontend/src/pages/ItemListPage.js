import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { debounce } from 'lodash';
import './ItemListPage.css';
import Masonry from 'react-masonry-css';
import ItemCard from '../components/ItemCard';


const ItemListPage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Colors array
  const colors = [
    { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' }, { name: 'Blue', hex: '#0000FF' }, { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' }, { name: 'Purple', hex: '#800080' }, { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#000080' }, { name: 'Teal', hex: '#008080' }, { name: 'Maroon', hex: '#800000' },
    { name: 'Olive', hex: '#808000' }, { name: 'Mint', hex: '#98FF98' }, { name: 'Coral', hex: '#FF7F50' },
    { name: 'Burgundy', hex: '#800020' }, { name: 'Lavender', hex: '#E6E6FA' }
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Sizes
  const sizeOptions = {
    default: ['XS', 'S', 'M', 'L', 'XL'],
    shoes: ['6', '7', '8', '9', '10', '11', '12'],
    pants: ['28', '30', '32', '34', '36', '38'],
  };

  const isClothingCategory = selectedCategory === 'Clothing';
  const sizeChoices =
    selectedItemType === 'Shoes'
      ? sizeOptions.shoes
      : selectedItemType === 'Bottoms'
      ? sizeOptions.pants
      : sizeOptions.default;

  // Color Dropdown State
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const colorDropdownRef = useRef(null);

  // Close color dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target)
      ) {
        setShowColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch brands whenever filters change (except brand filter to prevent infinite loop)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const params = {};

        if (searchTerm) params.search = searchTerm;
        if (selectedColor) params.color = selectedColor;
        if (selectedSize) params.size = selectedSize;
        if (selectedCondition) params.condition = selectedCondition;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedItemType) params.itemType = selectedItemType;

        const response = await axios.get('/api/items/brands', { params });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, [
    searchTerm,
    selectedColor,
    selectedSize,
    selectedCondition,
    selectedCategory,
    selectedItemType,
  ]);

  // Fetch items whenever filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params = {};

        if (searchTerm) params.search = searchTerm;
        if (selectedBrand) params.brand = selectedBrand;
        if (selectedColor) params.color = selectedColor;
        if (selectedSize) params.size = selectedSize;
        if (selectedCondition) params.condition = selectedCondition;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedItemType) params.itemType = selectedItemType;
        if (sortOrder) params.sort = sortOrder;

        const response = await axios.get('/api/items', { params });
        setItems(response.data);
      } catch (error) {
        setError('Error fetching items');
      }
    };

    fetchItems();
  }, [
    searchTerm,
    selectedBrand,
    selectedColor,
    selectedSize,
    selectedCondition,
    selectedCategory,
    selectedItemType,
    sortOrder,
  ]);

  // Handle filter changes
  const debouncedSearch = debounce((value) => setSearchTerm(value), 500);
  const handleSearchChange = (e) => debouncedSearch(e.target.value);

  const handleBrandChange = (e) => setSelectedBrand(e.target.value);
  const handleSizeChange = (e) => setSelectedSize(e.target.value);
  const handleConditionChange = (e) => setSelectedCondition(e.target.value);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItemType(''); // Reset item type when category changes
    setSelectedSize(''); // Reset size
  };

  const handleItemTypeChange = (e) => {
    setSelectedItemType(e.target.value);
    setSelectedSize(''); // Reset size when item type changes
  };
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedColor('');
    setSelectedSize('');
    setSelectedCondition('');
    setSelectedCategory('');
    setSelectedItemType('');
    setSortOrder('');
  };

  // Handle color selection
  const toggleColorDropdown = () => setShowColorDropdown(!showColorDropdown);

  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    setShowColorDropdown(false);
  };

  // Breakpoint columns for Masonry layout
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };


  return (
    <div className="item-list-page">
      <div className="filters-container">
        {/* Search Bar */}
        <div className="form-field">
          <label className="filter-label">Search</label>
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        {/* Brand Filter */}
        <div className="form-field">
          <label className="filter-label">Brand</label>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="filter-select"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.brand} value={brand.brand}>
                {brand.brand} ({brand.count})
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        <div className="form-field" ref={colorDropdownRef}>
          <label className="filter-label">Color</label>
          <button
            type="button"
            className="color-dropdown-btn"
            onClick={toggleColorDropdown}
          >
            {selectedColor || 'Select a color'}
            <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
          </button>
          {showColorDropdown && (
            <div className="color-grid-dropdown">
              {colors.map((colorOption, index) => (
                <div
                  key={index}
                  className={`color-swatch ${
                    selectedColor === colorOption.name ? 'color-selected' : ''
                  }`}
                  style={{ backgroundColor: colorOption.hex }}
                  onClick={() => handleColorSelect(colorOption.name)}
                  title={colorOption.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="form-field">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {['Clothing', 'Electronics', 'Books', 'Furniture', 'Accessories'].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        {/* Item Type Filter */}
        {isClothingCategory && (
          <div className="form-field">
            <label className="filter-label">Item Type</label>
            <select
              value={selectedItemType}
              onChange={handleItemTypeChange}
              className="filter-select"
            >
              <option value="">All Item Types</option>
              {['Tops', 'Bottoms', 'Shoes'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Size Filter */}
        {isClothingCategory && (
          <div className="form-field">
            <label className="filter-label">Size</label>
            <select
              value={selectedSize}
              onChange={handleSizeChange}
              className="filter-select"
            >
              <option value="">All Sizes</option>
              {sizeChoices.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Condition Filter */}
        <div className="form-field">
          <label className="filter-label">Condition</label>
          <select
            value={selectedCondition}
            onChange={handleConditionChange}
            className="filter-select"
          >
            <option value="">All Conditions</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="form-field">
          <label className="filter-label">Sort By</label>
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="filter-select"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      
        {/* Item List */}
        <div className="item-list-container">
        <h1 className="item-list-title">Available Items</h1>
        {error && <p>{error}</p>}

        {/* Item List with Masonry Layout */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="item-list"
          columnClassName="item-list-column"
        >
          {items.map((item) => (
            <ItemCard item={item} key={item.item_id} />
          ))}
        </Masonry>
      </div>
    
    </div>
  );
};

export default ItemListPage;
