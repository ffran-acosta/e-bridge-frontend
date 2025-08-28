"use client"
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';

export function useSearch(initialValue: string = '', delay: number = 300) {
    const [search, setSearch] = useState(initialValue);
    const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

    // Debounce para evitar demasiadas búsquedas
    const debouncedSetSearch = useMemo(
        () => debounce((value: string) => {
            setDebouncedSearch(value);
        }, delay),
        [delay]
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSetSearch(value);
    };

    return {
        search,
        debouncedSearch,
        setSearch: handleSearchChange,
        clearSearch: () => handleSearchChange('')
    };
}