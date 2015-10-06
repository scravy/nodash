foldl :: (a -> b -> b) -> b -> [a] -> b
foldl f s xs = case xs of
    [] -> s
    (x : xs) -> foldl f (f x s) xs
