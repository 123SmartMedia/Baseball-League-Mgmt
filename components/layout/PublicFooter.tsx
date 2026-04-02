export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card py-8 mt-12">
      <div className="container-app text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} League Platform. All rights reserved.
      </div>
    </footer>
  );
}
