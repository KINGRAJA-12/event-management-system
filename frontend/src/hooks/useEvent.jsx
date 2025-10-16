import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";

export const useEvent = create((set, get) => ({
  isFetch: false,
  isCreate: false,
  isUpdate: false,
  isDelete:null,
  isFetchMyEvent: false,
  isRegisterToEvent: false,
  isFetchRegisterUser: false,
  events: [],
  myEvents: [],
  registerUser: [],
  isFetchById:false,
  singlEvent:null,
  userEvent:null,
  isUserEventById:false,
  isSaveFromCsv:false,
  fetchAllEvents: async () => {
    try {
      set({ isFetch: true });
      let res = await axiosInstance.get("/event/all");
      console.log("fetch all event=", res?.data);
      set({ events: res?.data });
    } catch (err) {
      toast.error("failed to fetch! pls wait");
      console.log(err?.response?.data?.message || err?.message || "fetch error");
    } finally {
      set({ isFetch: false });
    }
  },

  createEvents: async (title, description, image, date, location, price, capacity) => {
    try {
      set({ isCreate: true });
      if (!title || !description || !date || !location || !price || !capacity)
        throw new Error("required data is missing");
      let res = await axiosInstance.post("/event", {
        title,
        description,
        image,
        date,
        location,
        price,
        capacity,
      });
       console.log("create event=", res?.data);
       set((state) => ({
        myEvents: [res?.data, ...state.myEvents],
      }));
      toast.success("Event added successfully");
    } catch (err) {
      toast.error("failed to create");
      console.log(err?.response?.data?.message || err?.response?.data?.error || err?.message || "create event error");
    } finally {
      set({ isCreate: false });
    }
  },

  updateEvents: async (id, title, description, image, date, location, price, capacity) => {
    try {
      set({ isUpdate: true });
      if (!id || !title || !description || !date || !location || !price || !capacity)
        throw new Error("required data is missing");
    let res = await axiosInstance.put(`/event/${id}`, {
        title,
        description,
        image,
        date,
        location,
        price,
        capacity,
      });
      console.log("update event=", res?.data);
      set((state) => ({
  myEvents: state.myEvents.map((event) =>
    event.event_id === id
      ? { ...event, title, description, image, date, location, price, capacity }
      : event
  ),
}));


      toast.success("Event updated successfully");
    } catch (err) {
      toast.error("Failed to update");
      console.log(err?.response?.data?.message || err?.response?.data?.error || err?.message || "update error");
    } finally {
      set({ isUpdate: false });
    }
  },

  deleteEvent: async (id) => {
    try {
      set({ isDelete:id });
      if (!id) throw new Error("required id is missing");
      let res = await axiosInstance.delete(`/event/${id}`);
      console.log("delete event=", res?.data);
      set((state) => ({
        myEvents: state.myEvents.filter((event) => event.event_id !== id),
      }));
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.error("failed to delete! pls try again");
      console.log(err?.response?.data?.message || err?.response?.data?.error || err?.message || "delete error");
    } finally {
      set({ isDelete:null });
    }
  },

  fetchMyEvents: async () => {
    try {
      set({ isFetchMyEvent: true });
      let res = await axiosInstance.get("/event/user");
      console.log("user events=", res?.data);
      set({ myEvents: res?.data });
    } catch (err) {
      toast.error("failed to fetch please try again");
      console.log(err?.response?.data?.message || err?.response?.data?.error || err?.message || "fetch my event error");
    } finally {
      set({ isFetchMyEvent: false });
    }
  },

  fetchRegisterUser: async (id) => {
    try {
      set({ isFetchRegisterUser: true });
      if (!id) throw new Error("required id is missing");
      let res = await axiosInstance.get(`/event/${id}/attendees`);
      console.log("fetch register user=", res?.data);
      set({ registerUser: res?.data });
    } catch (err) {
      toast.error("failed to fetch pls try again");
      console.log(err?.response?.data?.message || err?.response?.data?.error || err?.message || "fetch register user error");
    } finally {
      set({ isFetchRegisterUser: false });
    }
  },
  registerEvent:async(eventId,name,email,number)=>{
    try{
        set({isRegisterToEvent:true})
        if(!eventId || !name || !email || !number || number.length!=10)throw new Error("all field are required");
        let res=await axiosInstance.post("/event/register",{event:eventId,name,email,number});
        console.log("register event=",res?.data);
        set((state)=>({
          registerUser:[res?.data,...state.registerUser]
        }))
        toast.success("register succusfully! check your email");
    }catch(err){
        toast.error("registeration failed");
        console.log(err?.response?.data?.message|| err?.response?.data?.error ||err?.message||"register event is failed");
    }finally{
        set({isRegisterToEvent:false})
    }
  },
  fetchEventById:async(id)=>{
    try{
        set({isFetchById:true})
        if(!id)throw new Error("require id is missing");
        let res=await axiosInstance.get(`/event/view-event/${id}`);
        console.log("fetch event by id=",res?.data);
        set({singlEvent:res?.data});
    }catch(err){
        toast.error("failed to fetch");
        console.log(err?.response?.data?.message||err?.response?.data?.error ||err?.message||"fetch event by id error")
    }finally{
        set({isFetchById:false});
    }
  },
  fetchUserEventById:async(id)=>{
    try{
        set({isUserEventById:true})
        if(!id)throw new Error("require id is missing");
        let res=await axiosInstance.get(`/event/${id}`);
        console.log("fetch event by id=",res?.data);
        set({userEvent:res?.data});
    }catch(err){
        toast.error("failed to fetch please wait");
        console.log(err?.response?.data?.message||err?.response?.data?.error ||err?.message||"fetch event by id error")
    }finally{
        set({isUserEventById:false});
    }
  },
 SaveCsvEvent: async (data) => {
  try {
    set({ isSaveFromCsv: true });
    console.log("data=",data);
    if (!data || data.length <= 0) throw new Error("Data is missing");
    if (!Array.isArray(data)) throw new Error("Data must be an array");
    console.log(Array.isArray(data))
    for (let item of data) {
      let title=item?.title;
      let description=item?.description;
      let image=item?.image
      let date=item?.date
      let location=item?.location
      let price=item?.price
      let capacity=item?.capacity
      if (!title || !description || !date || !location || !price || !capacity)
        throw new Error("required data is missing");
      let res = await axiosInstance.post("/event", {
        title,
        description,
        image,
        date,
        location,
        price,
        capacity,
      });
       console.log("create event=", res?.data);
       set((state) => ({
        myEvents: [res?.data, ...state.myEvents],
      }));
      
    }
    toast.success("Events successfully added from CSV");
  } catch (err) {
    toast.error("failed to upload data from csv");
    console.log(err?.response?.data?.message ||err?.response?.data?.error || err?.message || "Save CSV event error");
  } finally {
    set({ isSaveFromCsv: false });
  }
}

}));
