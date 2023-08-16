import utils from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            utils.hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();

        $('[data-button-type="add-all-to-cart"]').on('click', (e) => this.addAllProductsToCart(e));
        $('[data-button-type="remove-all-from-cart"]').on('click', (e) => this.removeAllFromCart(e));
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }

    hideAlertBanners() {
        const element_add_all_to_cart_alart = document.getElementById("add-all-to-cart");
        const element_remove_all_from_cart_alart = document.getElementById("remove-all-from-cart");
        element_add_all_to_cart_alart.classList.add("hide");
        element_remove_all_from_cart_alart.classList.add("hide");
    }

    showAlertBanner(banner_type) {
        const element_add_all_to_cart_alart = document.getElementById("add-all-to-cart");
        const element_remove_all_from_cart_alart = document.getElementById("remove-all-from-cart");
        if (banner_type === "add_all") {
            element_add_all_to_cart_alart.classList.remove("hide");
        }
        if (banner_type === "remove_all") {
            element_remove_all_from_cart_alart.classList.remove("hide");
        }
    }

    showHideRemoveButton(action) {
        const element_remove_all_from_cart_button = document.getElementById("remove-all-from-cart-button");
        if (action === "show") {
            element_remove_all_from_cart_button.style.display = "inline-block"
        }
        if (action === "hide") {
            element_remove_all_from_cart_button.style.display = "none"
        }
    }

    addAllProductsToCart(e) {
        this.hideAlertBanners();
        utils.api.cart.getCart({}, (err, response) => {
            const cart_id = response ? `/${response.id}` : "";
            const cart_quantity = Number(localStorage.getItem('cart-quantity'));
            const products_list = $(e.currentTarget).data("productsList")
            let line_items = []
            products_list.forEach(product => {
                if (!product.has_options) {
                    line_items.push({
                        quantity: 1,
                        productId: product.id
                    });
                }
            });
            const cart_payload = {
                "lineItems": line_items
            }
            const route = "/api/storefront/carts" + cart_id + "/items";
            return fetch(route, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cart_payload),
            })
            .then(response => {
                $('body').trigger('cart-quantity-update', cart_quantity + line_items.length);
                this.showAlertBanner("add_all");
                this.showHideRemoveButton("show")
            })
            .catch(error => console.error(error));
        });
    }

    removeAllFromCart(e) {
        this.hideAlertBanners();
        utils.api.cart.getCart({}, (err, response) => {
            const cart_id = response.id;
            const cart_quantity = Number(localStorage.getItem('cart-quantity'));
            const route = "/api/storefront/carts/" + cart_id;
            fetch(route, {
                method: 'DELETE',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const status_code = response.status
                if (status_code === 204) {
                    $('body').trigger('cart-quantity-update', 0);
                    this.showAlertBanner("remove_all");
                    this.showHideRemoveButton("hide")
                }
            })
            .catch(err => console.error(err));
        });
    }
}