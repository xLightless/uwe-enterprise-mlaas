from django.test import TestCase
from .models import Post, CustomUser

class PostModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = CustomUser.objects.create_user(username='testuser', password='testpass')
        cls.post = Post.objects.create(title='Test Post', content='This is a test post.', author=cls.user)

    def test_post_content(self):
        self.assertEqual(self.post.title, 'Test Post')
        self.assertEqual(self.post.content, 'This is a test post.')
        self.assertEqual(self.post.author.username, 'testuser')

    def test_post_creation(self):
        self.assertIsInstance(self.post, Post)
        self.assertEqual(str(self.post), self.post.title)