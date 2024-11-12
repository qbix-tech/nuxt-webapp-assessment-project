export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    useCookie("redirect-path").value = to.path;
    return navigateTo("/auth/signin");
  }
});
