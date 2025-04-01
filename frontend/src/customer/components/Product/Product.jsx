import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { filters, singleFilter } from "./FilterData";
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
("use client");
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RestartAlt } from "@mui/icons-material";

const sortOptions = [
  { name: "Price: Low to High", href: "#", value: "price_low", current: false },
  { name: "Price: High to Low", href: "#", value: "price_high", current: false },
];



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paramObj, setParamObj] = useState({
    gender: null,
    category: null,
    minPrice: null,
    maxPrice: null,
    minDiscount: null,
    color: null,
    sort: null,
    pageNo: 0,
    pageSize: null,
  });

  // Keep paramObj for UI state (e.g., active category button, pagination)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setParamObj((prev) => ({
      ...prev,
      gender: searchParams.get("gender") || null,
      category: searchParams.get("category") || null,
      color: searchParams.get("color") || null,
      sort: searchParams.get("sort") || null,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
      minDiscount: searchParams.get("minDiscount") ? Number(searchParams.get("minDiscount")) : null,
      pageNo: searchParams.get("pageNo") ? Number(searchParams.get("pageNo")) : 0,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : null,
    }));
  }, [location.search]);

  // Modified: API fetch depends on location.search directly
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const params = new URLSearchParams();
        const gender = searchParams.get("gender");
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const minDiscount = searchParams.get("minDiscount");
        const color = searchParams.get("color");
        const sort = searchParams.get("sort");
        const pageNo = searchParams.get("pageNo");
        const pageSize = searchParams.get("pageSize");

        if(gender) params.append("gender", gender);
        if (category) params.append("category", category);
        if (minPrice !== null) params.append("minPrice", minPrice);
        if (maxPrice !== null) params.append("maxPrice", maxPrice);
        if (minDiscount !== null) params.append("minDiscount", minDiscount);
        if (color) params.append("color", color);
        if (sort) params.append("sort", sort);
        if (pageNo !== null) params.append("pageNo", pageNo);
        if (pageSize !== null) params.append("pageSize", pageSize);

        const queryString = params.toString();
        const url = queryString ? `/api/public/products?${queryString}` : "/api/public/products";

        console.log("Request URL:", url);
        const response = await axios.get(url, { withCredentials: true });
        setProductsList(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [location.search]); // Changed dependency from paramObj to location.search



  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.getAll(sectionId);

    if (filterValue.length > 0 && filterValue[0].split(",").includes(value)) {
      filterValue = filterValue[0].split(",").filter((item) => item !== value);
      if (filterValue.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValue.push(value);
    }

    if (filterValue.length > 0) {
      searchParams.set(sectionId, filterValue.join(","));
    }
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleRadiofilterChanger = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handlePageChange = (newPageNo) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("pageNo", newPageNo);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };



  const getPaginationButtons = () => {
    const maxButtons = 6;
    const buttons = [];
    const currentPage = paramObj.pageNo;
    const total = totalPages;

    if (total <= maxButtons) {
      return [...Array(total).keys()].map((page) => ({
        page,
        label: page + 1,
        isEllipsis: false,
      }));
    }

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(total - 1, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(0, endPage - maxButtons + 1);
    }

    if (startPage > 0) {
      buttons.push({ page: 0, label: 1, isEllipsis: false });
      if (startPage > 1) {
        buttons.push({ page: null, label: "...", isEllipsis: true });
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push({ page, label: page + 1, isEllipsis: false });
    }

    if (endPage < total - 1) {
      if (endPage < total - 2) {
        buttons.push({ page: null, label: "...", isEllipsis: true });
      }
      buttons.push({ page: total - 1, label: total, isEllipsis: false });
    }

    return buttons;
  };

  


  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog (unchanged) */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />
          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {paramObj.category ? `${paramObj.category}'s collection` : "New Arrivals"}
            </h1>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => {
                            const searchParams = new URLSearchParams(location.search);
                            searchParams.set("sort", option.value);
                            const query = searchParams.toString();
                            navigate({ search: `?${query}` });
                          }}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm w-full text-left data-focus:bg-gray-100 data-focus:outline-hidden"
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              <div>
                <div className="flex justify-between items-center py-10">
                  <h1 className="text-lg opacity-50 font-bold">Filters</h1>
                  <FilterListIcon />
                </div>
                <form className="hidden lg:block">
                  {filters.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    aria-hidden="true"
                                    className="size-5 text-gray-900"
                                  />
                                ) : (
                                  <PlusIcon
                                    aria-hidden="true"
                                    className="size-5 text-gray-900"
                                  />
                                )}
                              </span>
                            </DisclosureButton>
                          </h3>
                          <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex gap-3">
                                  <div className="flex h-5 shrink-0 items-center">
                                    <div className="group grid size-4 grid-cols-1">
                                      <input
                                        onChange={() =>
                                          handleFilter(option.value, section.id)
                                        }
                                        defaultValue={option.value}
                                        defaultChecked={option.checked}
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        type="checkbox"
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100"
                                      />
                                      <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                                      >
                                        <path
                                          d="M3 8L6 11L11 3.5"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-checked:opacity-100"
                                        />
                                        <path
                                          d="M3 7H11"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-indeterminate:opacity-100"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  {singleFilter.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <DisclosureButton className="relative group flex w-full my-[0.8rem] items-center bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="absolute left-0 font-medium text-gray-900 flex-1">
                                {section.name}
                              </span>
                              <span className="absolute right-0 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    aria-hidden="true"
                                    className="size-5 text-gray-900"
                                  />
                                ) : (
                                  <PlusIcon
                                    aria-hidden="true"
                                    className="size-5 text-gray-900"
                                  />
                                )}
                              </span>
                            </DisclosureButton>
                          </h3>
                          <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
                                >
                                  {section.options.map((option) => (
                                    <div key={option.id}>
                                      <FormControlLabel
                                        onChange={(e) =>
                                          handleRadiofilterChanger(e, section.id)
                                        }
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.label}
                                      />
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>

              <div className="lg:col-span-4 w-full">
                <div className="flex flex-wrap justify-center bg-white py-5">
                  {productsList.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => handlePageChange(paramObj.pageNo - 1)}
                    disabled={paramObj.pageNo === 0}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:bg-teal-300 hover:bg-teal-600"
                  >
                    Previous
                  </button>
                  {getPaginationButtons().map(({ page, label, isEllipsis }, index) => (
                    <button
                      key={isEllipsis ? `ellipsis-${index}` : page}
                      onClick={() => !isEllipsis && handlePageChange(page)}
                      disabled={isEllipsis}
                      className={classNames(
                        !isEllipsis && paramObj.pageNo === page
                          ? "bg-teal-600 text-white"
                          : isEllipsis
                          ? "bg-white text-gray-500 cursor-default"
                          : "bg-teal-500 text-white hover:bg-teal-600",
                        "px-4 py-2 rounded-md"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(paramObj.pageNo + 1)}
                    disabled={paramObj.pageNo >= totalPages - 1}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:bg-teal-300 hover:bg-teal-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Product;