import { Category } from '../models/index.js';
import { ok } from '../utils/response.js';

export async function categories(req,res){return ok(res,{items:await Category.find({active:true}).sort({sortOrder:1,name:1})});}
export async function adminCategories(req,res){return ok(res,{items:await Category.find().sort({sortOrder:1,name:1})});}
export async function createCategory(req,res){const slug=req.body.slug||req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-');return res.status(201).json({success:true,data:{category:await Category.create({...req.body,slug})}});}
export async function updateCategory(req,res){const c=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!c)return res.status(404).json({success:false,message:'Category not found.'});return ok(res,{category:c});}
export async function deleteCategory(req,res){const c=await Category.findByIdAndUpdate(req.params.id,{active:false},{new:true});if(!c)return res.status(404).json({success:false,message:'Category not found.'});return ok(res,{category:c});}
