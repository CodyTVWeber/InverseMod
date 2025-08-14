package main

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/inverse-mod", InverseModHandlerSteps).Methods("GET")
	router.HandleFunc("/inverse-mod-z", InverseModHandlerZ).Methods("GET")
	router.HandleFunc("/inverse-mod-explanation", InverseModHandlerExplanation).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

/*
InverseModHandlerSteps - Gives steps for how to solve the Inverse Mod
*/
func InverseModHandlerSteps(resp http.ResponseWriter, req *http.Request) {
	InverseModHandler(resp, req, true)
}

/*
InverseModHandlerZ - Just gives the solution
*/
func InverseModHandlerZ(resp http.ResponseWriter, req *http.Request) {
	InverseModHandler(resp, req, false)
}

/*
InverseModHandlerExplanation - Gives an explanation of how the Inverse Mod works.
*/
func InverseModHandlerExplanation(resp http.ResponseWriter, req *http.Request) {
	fmt.Fprintln(resp, inverseModExplanation())
}

/*
InverseModHandler is cool
*/
func InverseModHandler(resp http.ResponseWriter, req *http.Request, isSteps bool) {
	inputsX := req.URL.Query()["x"]
	inputsY := req.URL.Query()["y"]

	// Checking inputs
	if len(inputsX) <= 0 || len(inputsY) <= 0 {
		fmt.Fprintln(resp, "To use this, please make the URL match something like:\nhost:port/inverse-mod?x=<<insert positive integer>>&y=<<insert positive integer>>\n\n\n"+inverseModExplanation())
		resp.WriteHeader(400)
		return
	}

	xString := inputsX[0]
	yString := inputsY[0]

	isXNumber, _ := regexp.MatchString("^[1-9]\\d*$", xString)
	isYNumber, _ := regexp.MatchString("^[1-9]\\d*$", yString)
	if !isXNumber || !isYNumber {
		fmt.Fprintln(resp, "Error:\n x and/or y is not a positive integer, please make the URL match something like:\nhost:port/inverse-mod?x=<<insert positive integer>>&y=<<insert positive integer>>")
		resp.WriteHeader(400)
		return
	}

	x, _ := strconv.Atoi(xString)
	y, _ := strconv.Atoi(yString)

	if isSteps {
		fmt.Fprintln(resp, InverseModSteps(int64(x), int64(y)))
	} else {
		fmt.Fprintln(resp, InverseMod(int64(x), int64(y)))
	}
}

/*
inverseModExplanation returns a string describing how the inverseMod algorithm works.
*/
func inverseModExplanation() string {
	return `
Here is the algorithm written by Cody Weber

x mod y, where x and y are members of the positive non-zero integers.
z is a member of the positive non-zero integers
k values are a group of values that are members of the non-negative integers.
r values are a group of values that are members of the non-negative integers.  The goal is to get the last r value to equal 1, thus finding the inverse.
*Note:  This does not always work.  There is some tweaking needed to get this algorithm to hit the goal much more often, but I will tweak in later versions.

So steps:
So for x mod y,
1.  y < (x * k[1]) < (x + y), ((x * k[1]) % y) = r[1]
2.  y < (r[1] * k[2]) < (r[1] + y), ((r[1] * k[2]) % y) = r[2], r[2] < r[1]
...
n.  y < (r[n-1] * k[n]) < (r[n-1] + y), ((r[n-1] * k[n]) % y) = r[n] = 1 (or 0 if it did not work)

(k[1] * k[2] * ... * k[n]) mod y = z

Validation step:
(z * x) mod y == 1
`
}

/*
Performs inverseMod algorithm using x mod y.  If explanation desired, see the Inverse Mod Explanation.
*/
func inverseModFull(x int64, y int64) (string, int64) {
	var k []int64
	var r []int64
	var z int64

	result := fmt.Sprintln("\n\nCalculating the inverse of", x, "mod", y, "...")

	// Checking for special cases
	isSpecialCase, message := checkSpecialCases(x, y)
	if isSpecialCase {
		result += message
		return result, 0
	}

	// Performing do-while
	if (x % y) == 0 {
		k = append(k, (y / x))
	} else {

		k = append(k, ((y / x) + 1))
	}
	r = append(r, ((x * k[0]) % y))
	result += fmt.Sprintln("Step 1 :", y, " < (", x, "*", k[0], ") < (", y, "+", x, "), ((", x, "*", k[0], ") %", y, ") =", r[0])

	for n := 1; r[n-1] > 1; n++ {

		// Calculating if multiple comes out to 0 or a non-zero remainder
		if (y % r[n-1]) == 0 {
			k = append(k, (y / r[n-1]))
		} else {
			k = append(k, ((y / r[n-1]) + 1))
		}

		r = append(r, ((r[n-1] * k[n]) % y))
		result += fmt.Sprintln("Step", n+1, ":", y, "< (", r[n-1], "*", k[n], ") < (", y, "+", r[n-1], "), ((", r[n-1], "*", k[n], ") %", y, ") =", r[n])
	}

	z = 1
	for _, valueK := range k {
		z *= valueK
	}
	z = z % y
	result += fmt.Sprintln("(k[1] * k[2] * ... * k[n]) mod y =", z)

	result += fmt.Sprintln("\n\nFinal Values:")
	result += fmt.Sprintln("x =", x)
	result += fmt.Sprintln("y =", y)
	result += fmt.Sprintln("k[] =", k)
	result += fmt.Sprintln("r[] =", r)
	result += fmt.Sprintln("z =", z)

	result += fmt.Sprintln("\n\nValidation step:")
	result += fmt.Sprintln("((", z, "*", x, ") mod", y, ") == 1 is", (((z * x) % y) == 1))

	return result, z
}

/*
InverseModSteps - Shows the steps of the inverse.
*/
func InverseModSteps(x int64, y int64) string {
	steps, _ := inverseModFull(x, y)
	return steps
}

/*
InverseMod - This just finds the answer of the inverse.
*/
func InverseMod(x int64, y int64) int64 {
	_, z := inverseModFull(x, y)
	return z
}

func checkSpecialCases(x int64, y int64) (bool, string) {
	isSpecialCase := false
	message := ""

	// Case 1:  x or y cannot be 0
	if x == 0 {
		isSpecialCase = true
		message += "Error:  x cannot be zero."
	}
	if y == 0 {
		isSpecialCase = true
		message += "Error:  y cannot be zero."
	}
	if isSpecialCase {
		return isSpecialCase, message
	}

	// Case 2:  x cannot be a multiple of y and vice versa
	if (x % y) == 0 {
		isSpecialCase = true
		message += fmt.Sprintln(x, "is a multiple of", y, "which gives z = 0, no inverse")
	}

	return isSpecialCase, message
}
