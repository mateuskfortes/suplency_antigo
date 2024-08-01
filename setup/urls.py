from django.contrib import admin
from django.urls import path
from suplency.views import HomeView, estudoView, loginView, singinView, logoutView, deleteFlashCard, salvarCaderno, cadernoView, saveFlashCard, loadFlashCard, flashCardView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView, name='home'),
    path('estudo/', estudoView, name='estudo'),
    path('logout/', logoutView, name='logout'),
    path('login/', loginView, name='login'),
    path('singin/', singinView, name='singin'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name = "suplency/reset_password.html"), name ='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name = "suplency/password_reset_sent.html"), name ='password_reset_done'),
    path('reset/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(template_name = "suplency/password_reset_form.html"), name ='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name = "suplency/password_reset_done.html"), name ='password_reset_complete'),
    path('caderno/save/', salvarCaderno, name='salvar_caderno'),
    path('caderno', cadernoView, name='caderno'),
    path('flashcard', flashCardView, name='flashcard'),
    path('flashcard/load', loadFlashCard, name='load_flashcard'),
    path('flashcard/save', saveFlashCard, name='save_flashcard'),
    path('flashcard/delete/<uuid:id>', deleteFlashCard, name="delete_flashcard"),
]

