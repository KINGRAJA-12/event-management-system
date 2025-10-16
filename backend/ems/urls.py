from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView,LoginView,ProfileView,RegisterEventClass,EventViewByUserClass,FetchEventByUser,FetchEventClass,EventClass,LogoutView,GetRegisterUsersForEachClass,EventUpdateDeleteClass
urlpatterns = [
    # auth
    path("api/v1/auth/register", RegisterView.as_view(), name="register"),
    path("api/v1/auth/login", LoginView.as_view(), name="login"),
    path("api/v1/auth/get-me", ProfileView.as_view(), name="profile"),
    path("api/v1/auth/logout", LogoutView.as_view(), name="logout"),
    path("api/v1/auth/refresh-token",TokenRefreshView.as_view(),name="refresh-token"),
    # events
    path("api/v1/event", EventClass.as_view(), name="create-event"),
    path("api/v1/event/<int:event_id>", EventUpdateDeleteClass.as_view(), name="update-delete-event"),
    path("api/v1/event/user", FetchEventByUser.as_view(), name="user-events"),
    path("api/v1/event/view-event/<int:id>",EventViewByUserClass.as_view(),name="view-event"),
    path("api/v1/event/all", FetchEventClass.as_view(), name="all-events"),
    path("api/v1/event/register", RegisterEventClass.as_view(), name="register-event"),
    path("api/v1/event/<int:id>/attendees", GetRegisterUsersForEachClass.as_view(), name="event-attendees"),
]
