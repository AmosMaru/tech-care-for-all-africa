
from .test_setup import TestSetup
from rest_framework import status
from api.models import Product
from django.test import TestCase
from django.urls import reverse

class TestView(TestSetup):
    
    def test_user_cannot_register_without_data(self):
        response = self.client.post(self.register_url)
        self.assertEqual(response.status_code, 400)

    def test_user_can_register_correctly(self):
        response = self.client.post(self.register_url, self.user_data, format='json') 
        self.assertEqual(response.status_code, 201)


    def test_user_cannot_login_without_data(self):
        response = self.client.post(self.login_url)
        self.assertEqual(response.status_code, 400)


    def test_user_cannot_login_with_incorectdata(self):
        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertEqual(response.status_code, 401)



        

from rest_framework.test import APIClient
from django.contrib.auth.models import User

class ProductViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
        )

    def test_product_list(self):
        url = reverse('product_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_create(self):
        url = reverse('product_create')
        data = {
            'name': 'New Product',
            'description': 'New Description',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)

    def test_product_delete(self):
        url = reverse('product_delete', kwargs={'pk': self.product.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)