import React from "react";

function DropdownMenu({ menuData }) {
  return (
    <div className="dropdown-menu">
      <div className="dropdown-content">
        {menuData.columns.map((column, index) => (
          <div key={index} className="dropdown-column">
            <div className="dropdown-column-title">{column.title}</div>
            {column.items.map((item, itemIndex) => (
              <a
                key={itemIndex}
                href={item.href}
                className={item.highlight ? "highlight-link" : ""}
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownMenu;
