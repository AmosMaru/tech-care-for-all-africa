from django.contrib import admin
from django.urls import path, include
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    path('user/register/', UserCreate.as_view(), name='user_create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    
    path('accounts/', include('allauth.urls')),
    path('callback/', google_login_callback, name='callback'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('google/validate_token/', validate_google_token, name='validate_token'),

    # product routes
    path('products_list/', ProductList.as_view(), name='product_list'),
    path('crreate_product/', CreareProduct.as_view(), name='product_create'),
    path('delete_product/<int:pk>/', DeleteProduct.as_view(), name='product_delete'),
    path('product_details/<int:pk>/', ProductDetail.as_view(), name='product_detail'),


    # order routes
    path('order_list/', OrderItemList.as_view(), name='order_list'),
    path('add_to_product_to_cart/<int:pk>/', AddToCart.as_view(), name='order_create'),
    path('delete_order_item/<int:pk>/', DeleteOrderItem.as_view(), name='order_item_delete'),


    path('send_sms/', SendSMSView.as_view(), name='send_sms'),

]
 