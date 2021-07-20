function useQuery() {
    return new URLSearchParams(window.location.search);
}

export { useQuery };