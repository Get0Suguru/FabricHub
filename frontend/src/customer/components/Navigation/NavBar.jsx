'use client'
import { Fragment, useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import UserProfileMenu from './UserProfileMenu'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function NavBar({
  navigation, 
  userProfileModalOpen, 
  currentAuthFormState, 
  onToggleUserProfileModal, 
  onAuthFormStateChange, 
  onNavigateAndCloseModal 
}) {
  const [open, setOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const navigate = useNavigate()
  const searchContainerRef = useRef(null)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setSearchError(null)
      return
    }
    setSearchLoading(true)
    setSearchError(null)
    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/public/products/search?queryString=${searchQuery}`)
        setSearchResults(response.data || [])
        if (response.data.length === 0) {
          setSearchError('No products found.')
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
        setSearchResults([])
        setSearchError(error.response?.data?.message || 'Failed to fetch results.')
      } finally {
        setSearchLoading(false)
      }
    }, 500)
    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false)
        setSearchResults([])
        setSearchError(null)
      }
    }
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  const handleSearchIconClick = () => {
    if (isSearchOpen && searchQuery) {
      setIsSearchOpen(!isSearchOpen) 
    } else {
      setIsSearchOpen(!isSearchOpen)
    }
    if (!isSearchOpen) { 
      setSearchQuery('')
      setSearchResults([])
      setSearchError(null)
    }
  }

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`)
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
  }

  const handleCartClick = () => {
    if (currentAuthFormState !== 'Logout') {
      onToggleUserProfileModal();
    } else {
      navigate('/cart');
    }
  };

  const handleMobileSignIn = () => {
    onAuthFormStateChange("Login");
    onToggleUserProfileModal();
    setOpen(false);
  };

  const handleMobileCreateAccount = () => {
    onAuthFormStateChange("Register");
    onToggleUserProfileModal();
    setOpen(false);
  };

  const handleMobileMyAccount = () => {
    onToggleUserProfileModal();
    setOpen(false);
  };

  return (
    <div className="relative top-0 left-0 w-full bg-white z-50">
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                    {page.name}
                  </a>
                </div>
              ))}
            </div>
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {currentAuthFormState !== 'Logout' ? (
                <>
                  <div className="flow-root">
                    <button onClick={handleMobileSignIn} className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </button>
                  </div>
                  <div className="flow-root">
                    <button onClick={handleMobileCreateAccount} className="-m-2 block p-2 font-medium text-gray-900">
                      Create account
                    </button>
                  </div>
                </>
              ) : (
                <div className="flow-root">
                  <button onClick={handleMobileMyAccount} className="-m-2 block p-2 font-medium text-gray-900">
                    My Account
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white border-b border-gray-200">
        <p className="flex h-10 items-center justify-center bg-teal-500 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on cart above 499₹
        </p>
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
            <div className="ml-4 flex lg:ml-0">
              <a href="/home">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=500"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
              <div className="flex h-full space-x-8">
                {navigation.categories.map((category) => (
                  <Popover key={category.name} className="flex">
                    <div className="relative flex">
                      <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:border-indigo-600 data-open:text-indigo-600">
                        {category.name}
                      </PopoverButton>
                    </div>
                    <PopoverPanel
                      transition
                      className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                    >
                      <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                      <div className="relative bg-white">
                        <div className="mx-auto max-w-7xl px-8">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                            <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                              {category.sections.map((section) => (
                                <div key={section.name}>
                                  <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                    {section.name}
                                  </p>
                                  <ul
                                    role="list"
                                    aria-labelledby={`${section.name}-heading`}
                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                  >
                                    {section.items.map((item) => (
                                      <li key={item.name} className="flex">
                                        <a href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="col-start-2 grid grid-cols-2 gap-x-8">
                              {category.featured.map((item) => (
                                <div key={item.name} className="group relative text-base sm:text-sm">
                                  <img
                                    alt={item.imageAlt}
                                    src={item.imageSrc}
                                    className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                  />
                                  <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                    <span aria-hidden="true" className="absolute inset-0 z-10" />
                                    {item.name}
                                  </a>
                                  <p aria-hidden="true" className="mt-1">
                                    Shop now
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </Popover>
                ))}
                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {page.name}
                  </a>
                ))}
              </div>
            </PopoverGroup>
            <div className="ml-auto flex items-center">
              <UserProfileMenu 
                isOpen={userProfileModalOpen}
                onToggleModal={onToggleUserProfileModal}
                formState={currentAuthFormState}
                onFormStateChange={onAuthFormStateChange}
                onNavigateAndClose={onNavigateAndCloseModal}
              />
              <div ref={searchContainerRef} className="relative flex items-center lg:ml-6">
                {!isSearchOpen ? (
                  <button onClick={handleSearchIconClick} className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                  </button>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="h-10 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-300 w-48 lg:w-64"
                      autoFocus
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => { 
                          setSearchQuery(''); 
                          setSearchResults([]); 
                          setSearchError(null);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="size-5" />
                      </button>
                    )}
                  </div>
                )}
                {isSearchOpen && (searchQuery || searchLoading || searchError || searchResults.length > 0) && (
                    <div className="absolute top-full mt-2 w-72 lg:w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-20 right-0 lg:right-auto lg:left-0">
                    {searchLoading && (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    )}
                    {searchError && !searchLoading && (
                        <div className="p-4 text-center text-red-500">{searchError}</div>
                    )}
                    {!searchLoading && !searchError && searchResults.length > 0 && (
                        <ul className="divide-y divide-gray-100">
                            {searchResults.map((product) => (
                                <li 
                                    key={product.id} 
                                    onClick={() => handleResultClick(product.id)}
                                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                                >
                                    <img 
                                        src={product.imageUrl || 'https://via.placeholder.com/40?text=N/A'} 
                                        alt={product.title}
                                        className="w-10 h-10 object-cover rounded-sm shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                                        <p className="text-sm font-semibold text-teal-600">₹{product.discountedPrice?.toFixed(2) || product.price?.toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                )}
              </div>
              <div className="ml-4 flow-root lg:ml-6">
                <button onClick={handleCartClick} className="group -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                  <span className="sr-only">items in cart, view bag</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
