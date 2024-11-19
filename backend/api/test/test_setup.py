from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from api.models import Product

class TestSetup(APITestCase):
        
        def setUp(self):
            self.register_url = reverse('user_create')
            self.login_url = reverse('token_obtain_pair')
            self.user_detail_url = reverse('user_detail')
            self.products_list = reverse('product_list')
            # self.product_create = reverse('product_create')
            # self.product_delete = reverse('product_delete', kwargs={'pk': self.product.pk})


            self.user_data = {
                'email': 'email@gmail.com',
                'username': 'email',
                'password': 'email'
                }
            
            self.login_data = {
            'username': 'adam@mail.com',
            'password': 'Pass1234!'
            }



            # self.user = User.objects.create_user(
            #     username='testuser',
            #     password='testpass123'
            # )
            # self.client.force_authenticate(user=self.user)
            
            # self.product = Product.objects.create(
            #     name='Test Product',
            #     description='Test Description',
            #     price=99.99
            # )

           

            return super().setUp()

        def tearDown(self) -> None:
              return super().tearDown()
            
          
