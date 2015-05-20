require(
[
    "react"
],
function(React){
    /** @jsx React.DOM */
    var Counter = React.createClass({displayName: "Counter",
        incrementOne: function(){
            this.setState({
                count: this.state.count+1
            });
        },
        getInitialState: function(){
            return {
                count: 0
            }
        },
        render: function(){
            return (
                React.createElement("div", {className: "custom-component"}, 
                    React.createElement("h1", null, "Contador: ",  this.state.count), 
                    React.createElement("button", {type: "button", onClick: this.incrementOne}, "Increment")
                )
            );
        }
    });

    React.render(
        React.createElement(Counter, null),
        document.getElementById('myDiv')
    );
});
