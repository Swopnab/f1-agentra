(function(root){
    function calculateSizing(capital, riskFraction) {
        capital=Number(capital);riskFraction=Number(riskFraction);
        if (!Number.isFinite(capital) || capital<0 || !Number.isFinite(riskFraction) || riskFraction<0 || riskFraction>1) throw new RangeError('Use finite non-negative inputs; risk must be between 0 and 1');
        const shares=Math.min(capital*riskFraction,capital*.25/20);
        return {shares,loss:shares,allocation:shares*20,allocationFraction:capital?shares*20/capital:0};
    }
    if(typeof module!=='undefined')module.exports={calculateSizing};else root.DemoSizing={calculateSizing};
})(globalThis);
