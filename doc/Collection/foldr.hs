foldr :: (b -> a -> b) -> b -> [a] -> b
foldr f s xs = case xs of
    [] -> s
    (x : xs) -> f (foldr f s xs) x
