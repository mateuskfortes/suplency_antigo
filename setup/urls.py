from django.contrib import admin
from django.urls import path
from suplency.views import HomeView, estudoView, loginView, singinView, carregarPagina, logoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView, name='home'),
    path('estudo/', estudoView, name='estudo'),
    path('logout/', logoutView, name='logout'),
    path('login/', loginView, name='login'),
    path('singin/', singinView, name='singin'),
    path('caderno/<str:materia>/<int:pagina>', carregarPagina),
]
