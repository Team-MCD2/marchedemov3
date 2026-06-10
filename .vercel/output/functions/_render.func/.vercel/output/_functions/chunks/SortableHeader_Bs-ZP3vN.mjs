import { jsx, jsxs } from 'react/jsx-runtime';

function SortableHeader({
  field,
  label,
  sort,
  onSort,
  align = "left",
  className = ""
}) {
  const isActive = sort?.field === field;
  const dir = isActive ? sort.dir : null;
  const ariaSort = !isActive ? "none" : dir === "asc" ? "ascending" : "descending";
  function handle() {
    if (!isActive) onSort(field, "asc");
    else onSort(field, dir === "asc" ? "desc" : "asc");
  }
  const alignCls = align === "right" ? "text-right justify-end" : align === "center" ? "text-center justify-center" : "text-left";
  return /* @__PURE__ */ jsx(
    "th",
    {
      scope: "col",
      "aria-sort": ariaSort,
      className: `px-4 py-3 font-bold ${className}`,
      children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handle,
          className: `inline-flex items-center gap-1.5 ${alignCls} w-full hover:text-noir transition`,
          children: [
            /* @__PURE__ */ jsx("span", { children: label }),
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: `inline-flex flex-col leading-none ${isActive ? "text-noir" : "text-neutral-300"}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: `w-2.5 h-2.5 -mb-0.5 ${isActive && dir === "asc" ? "text-vert" : ""}`,
                      viewBox: "0 0 10 6",
                      fill: "currentColor",
                      children: /* @__PURE__ */ jsx("path", { d: "M5 0 10 6H0z" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: `w-2.5 h-2.5 ${isActive && dir === "desc" ? "text-vert" : ""}`,
                      viewBox: "0 0 10 6",
                      fill: "currentColor",
                      children: /* @__PURE__ */ jsx("path", { d: "M5 6 0 0h10z" })
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}

export { SortableHeader as S };
