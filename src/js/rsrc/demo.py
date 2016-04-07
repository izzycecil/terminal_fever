#!/usr/bin/python3

def factorial(n):
    if n == 0:
        return 1

    return n * factorial(n - 1)

def fibonacci(n):
    if (n <= 1):
        return 1

    return fibonacci(n - 1) + fibonacci(n - 2)

def quicksort(ls):
    if len(ls) <= 1:
        return ls

    pivot = ls[0]
    small = [x for x in ls[1:] if x <= pivot]
    big = [x for x in ls[1:] if x > pivot]

    return quicksort(small) + pivot + quicksort(big)
