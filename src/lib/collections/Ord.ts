interface Ord {
	lessThan(other: this): boolean;

	greaterThan(other: this): boolean;

	equalTo(other: this): boolean;
}
