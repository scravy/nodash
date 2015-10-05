foldl :: (a -> b -> b) -> b -> [a] -> b
foldl f s = \case
    [] -> s
    (x : xs) -> foldl f (f x s) xs
