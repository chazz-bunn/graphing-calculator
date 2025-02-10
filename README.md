https://chazz-bunn.github.io/graphing-calculator/

Feature to add: Factorials

Idea: Make the canvas for a set size and stretch it out as needed, might be able to use fewer splines as well.

Issue: Vertical Asymptotes get drawn when I don't want them to, need a solution to fix that.
    Categories of asymptotes:
        Rational expressions
        Roots
        Logarithmic functions
        Trig functions
    I have a plan to deal with roots and logarithms by catching splines that go from undefined to defined.
    And I have a plan for trig functions by using their periodicity.
    Rational expressions elude me though. Even(div by 2) roots of even exponent variable and logs of even exponent variables will be tricky too.

Issue: When graphing x^-2 it graphs (x^-1)*2, x^(-2) is correct. Perhaps I'll fix it when I overhaul UI.