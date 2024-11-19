from django.shortcuts import redirect
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,ProductSerializer,ProductCreateSerializer,ProductDeleteSerializer,OrderSerializer,SerializerAddToCart,DeleteOrderItemSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from dotenv import load_dotenv
import json
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status



import os

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print('No Google token found for user', user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')


@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)


# CRUD on products
from .models import Product

class CreareProduct(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated]

class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class DeleteProduct(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDeleteSerializer
    permission_classes = [IsAuthenticated]


class ProductDetail(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

# CRUD on orders

from .models import Order,OrderItem

class OrderItemList(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the authenticated user
        user = self.request.user
        # Return only OrderItems that belong to orders owned by this user
        return OrderItem.objects.filter(order__customer=user)
    
class AddToCart(generics.CreateAPIView):
    serializer_class = SerializerAddToCart
    permission_classes = [IsAuthenticated]

class DeleteOrderItem(generics.DestroyAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = DeleteOrderItemSerializer
    permission_classes = [IsAuthenticated]


class SendSMSView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        phone_number = request.data.get('phone_number')
        message = request.data.get('message')

        if not phone_number or not message:
            return Response(
                {'error': 'Phone number and message are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            endpoint = os.getenv('SMS_URL')
            api_key = os.getenv('SMS_API_KEY')
            from_ = os.getenv('SMS_FROM')

            sms_request = {
                'to': phone_number,
                'from': from_,
                'message': message
            }

            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }

            response = requests.post(
                endpoint, 
                data=json.dumps(sms_request), 
                headers=headers
            )
            
            response.raise_for_status()

            return Response({'message': 'SMS sent successfully'})

        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'Failed to send SMS: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )