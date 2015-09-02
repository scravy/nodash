`[Bool] → Bool`

Returns the disjunction of a Boolean list, i.e. it returns `false` iff all the
elements in the list evaluate to `false`.

*NOTE:* This, the lowercase `or`, is not the binary boolean operator, which
is the uppercase `OR`.

Example:

    or([true, false, true]) === true
    or([false, false, false]) === false
    or([0, 0, 0]) === false
    or([]) === true
