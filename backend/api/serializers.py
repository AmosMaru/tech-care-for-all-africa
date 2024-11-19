from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product , Order,OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = { 'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        return product

class ProductDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
    def delete(self, validated_data):
        product = Product.objects.delete(**validated_data)
        return product
    

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'



class SerializerAddToCart(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'amount', 'order', 'product')  
        read_only_fields = ('id', 'order', 'product')  

    def create(self, validated_data):
        # Get the user from the request
        customer = self.context['request'].user
        
        # Get the product ID from the URL
        product_id = self.context['view'].kwargs.get('pk')
        
        # Get or create an order for this customer
        order, created = Order.objects.get_or_create(
            customer=customer,  # Changed from user to customer
        )
        
        # Create the order item with the order and product
        order_item = OrderItem.objects.create(
            order=order,
            product_id=product_id,
            amount=validated_data.get('amount', 1)
        )
        
        return order_item


class DeleteOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        
    def delete(self, validated_data):
        order_item = OrderItem.objects.delete(**validated_data)
        return order_item
    
