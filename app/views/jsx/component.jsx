require(
[
    "react"
],
function(React){
    /** @jsx React.DOM */
    var Counter = React.createClass({
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
                <div className="custom-component">
                    <h1>Contador: { this.state.count }</h1>
                    <button type="button" onClick={this.incrementOne}>Increment</button>
                </div>
            );
        }
    });

    React.render(
        <Counter/>,
        document.getElementById('myDiv')
    );
});
