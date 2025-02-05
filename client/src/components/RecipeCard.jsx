import { useGetUserId } from "../hooks/useGetUserId";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function RecipeCard(props) {
  const userId = useGetUserId();
  const navigate = useNavigate();
  const [cookies, _] = useCookies(["access_token"]);

  const saveRecipeInDb = (recipeId, userId) => {
    props.saveRecipe(recipeId, userId);
  };

  const isRecipeSaved = (id) => props.savedRecipesId.includes(id);

  const handleClick = () => {
    if (!cookies.access_token) {
      alert("You are not logged in!");
      navigate("/auth/login");
    } else saveRecipeInDb(props._id, userId);
  };

  return (
    <div className="card">
      <div className="card__image">
        <img
          className="card__image--img"
          src={props.imageUrl}
          alt="Recipe Image"
        />
        <button
          data-saved={isRecipeSaved(props._id) ? true : false}
          onClick={handleClick}
          className="save"
          disabled={isRecipeSaved(props._id)}
        >
          {isRecipeSaved(props._id) ? "Saved" : "Save"}
        </button>
      </div>
      <div className="recipe__details">
        <div className="recipe__details--title">
          <h3 className="recipe__details--title-el">{props.name}</h3>
        </div>
        <div className="recipe__details--gradients">
          <span className="el-title">Gredients: </span>
          {props.ingredients.map((ingredient, index) => {
            return (
              <span className="el-value" key={index}>
                {ingredient}
                {", "}
              </span>
            );
          })}
        </div>
        <div className="recipe__details--instructions">
          <span className="el-title">Instruction:</span>
          <h4 className="el-value">
            {props.instructions}
            <button type="button" className="readmore__btn">
              Read More
            </button>
          </h4>
        </div>
        <div className="recipe__details--author">
          <span className="el-title">Added By: </span>
          <h4 className="recipe__details--author-item el-value">
            {props.owner}
          </h4>
        </div>
        <div className="recipe__details--cookingtime">
          <span className="el-title">Cooking Time:</span>
          <h4 className="recipe__details--cookingtime-item el-value">
            {props.cookingTime ? props.cookingTime : 30} min
          </h4>
        </div>
      </div>
    </div>
  );
}
