foldr :: (b -> a -> b) -> b -> [a] -> b
foldr f s = \case
    [] -> s
    (x : xs) -> f (foldr f s xs) x
