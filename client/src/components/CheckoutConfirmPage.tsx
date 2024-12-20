import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"


const CheckoutConfirmPage = ({open,setOpen}:{open:boolean,setOpen:Dispatch<SetStateAction<boolean>>})=>{

    const [input,setInput] = useState({
        name:"",
        email:"",
        contact:"",
        address:"",
        city:"",
        country:""

    })
    const changeEventHandler = (e:ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setInput({...input,[name]:value})

    }
    const checkoutHandler = (e:FormEvent)=>{
        e.preventDefault();
        console.log(input);
        

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle className="font-bold">Review Your Order</DialogTitle>
                <DialogDescription className="text-xs">
                    Double-check your delivery details and ensure everything is in order. When you are ready. hit confirm button to finalize your order
                </DialogDescription>
                <form onSubmit={checkoutHandler}
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
                    <div >
                        <Label>Fullname</Label>
                        <Input 
                        type="text"
                        name = "name"
                        value = {input.name}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                    <div >
                        <Label>Email</Label>
                        <Input 
                        type="email"
                        name = "email"
                        value = {input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                    <div >
                        <Label>Contact</Label>
                        <Input 
                        type="contact"
                        name = "contact"
                        value = {input.contact}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                    <div >
                        <Label>Address</Label>
                        <Input 
                        type="text"
                        name = "address"
                        value = {input.address}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                    <div >
                        <Label>City</Label>
                        <Input 
                        type="text"
                        name = "city"
                        value = {input.city}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input 
                        type="text"
                        name = "country"
                        value = {input.country}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-1"
                        
                        />

                    </div>
                
            
            <DialogFooter className="col-span-2 pt-5">
                <Button className="bg-orange hover:bg-orangeHover">Continue To Payment</Button>
            </DialogFooter>
            </form>
            </DialogContent>

        </Dialog>
    )

}
export default CheckoutConfirmPage