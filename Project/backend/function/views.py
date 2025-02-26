from django.shortcuts import render
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return render(request, 'playground/post_list.html',
                      {'posts': serializer.data})

    def retrieve(self, request, pk=None):
        post = self.get_object()
        serializer = self.get_serializer(post)
        return render(request, 'playground/post_detail.html',
                      {'post': serializer.data})

# Additional view functions can be added here as needed.
