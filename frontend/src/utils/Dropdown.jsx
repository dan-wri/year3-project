import React, { useState, useRef, useEffect } from "react";

export function Dropdown({ options, selected, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isTextFadeIn, setIsTextFadeIn] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        onSelect(option);
        setIsTextFadeIn(true);
        setTimeout(() => {
        setIsTextFadeIn(false);
        }, 300);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div
                className={`dropdown-select ${isOpen ? "dropdown-select-clicked" : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                }}
            >
                <span
                className={`dropdown-selected ${isTextFadeIn ? "text-fade-in" : ""}`}
                >
                    {selected}
                </span>
                <div className={`caret ${isOpen ? "caret-rotate" : ""}`}></div>
            </div>
            <ul className={`dropdown-menu ${isOpen ? "dropdown-menu-open" : ""}`}>
                {options.map((option) => (
                    <li
                        key={option}
                        className={option === selected ? "dropdown-active" : ""}
                        onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(option);
                        }}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
}