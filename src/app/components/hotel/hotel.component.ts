import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '../../services/side-nav.service';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})

export class HotelComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  public hotels = [];
  public hotel;
  public cartItems = [];
  public totalAmount = 0;
  public isFetched = false;
  public toggleMode = 'over';
  public userName = '';
  public isSideNavShowing = false;

  constructor(private hotelService: HotelService, private route: ActivatedRoute,
              private router: Router, private sidenavService: SideNavService) { }

  scrollTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  getHotel = (id: number) => {
    try {
      return this.hotels.filter((hotel) => hotel.id === id);
    }
    catch (e) {
      console.log(e);
    }
  }

  addToMyCart = (menu) => {
    const newItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1
    };

    if (this.isItemAlreadyExist(newItem)) {
      this.itemAlreadyExistModal(newItem);
    }
    else {
      this.addItemToMyCart(newItem);
      this.itemAddedModal(newItem);
      this.calculateAmount();
    }
  }

  addItemToMyCart = (newItem) => {
    this.hotelService.setCartItem(newItem);
    this.cartItems = this.hotelService.cartItems;
  }

  isItemAlreadyExist = (newItem) => {
    return this.hotelService.cartItems.find((cartItem) => cartItem.id === newItem.id);
  }

  itemAddedModal = (newItem) => {
    Swal.fire({
      icon: 'success',
      title: `${newItem.name} added to your basket!`,
      text: 'Click on \'View My Basket\' button below to view your basket or click on the basket icon at the top of the page',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      confirmButtonText: 'View My Basket',
      cancelButtonText: 'Close',
      cancelButtonColor: '#e23c3c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleSideNav();
      }
    });
  }

  toggleSideNav = () => {
    this.scrollTop();
    this.sidenavService.toggle();
  }

  itemAlreadyExistModal = (newItem) => {
    Swal.fire({
      icon: 'warning',
      title: `${newItem.name} is already exist in your basket!`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      confirmButtonText: 'View My Basket',
      cancelButtonText: 'Close',
      cancelButtonColor: '#e23c3c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleSideNav();
      }
    });
  }

  removeItem = (cartItem) => {
    this.hotelService.removeCartItem(cartItem);
    this.cartItems = this.hotelService.cartItems;
    this.calculateAmount();
  }

  addQuantity = (cartItem) => {
    this.cartItems.forEach((item, index) => {
      if (item.id === cartItem.id) {
        this.cartItems[index].quantity = Number(this.cartItems[index].quantity)  + 1;
      }
   });
    this.calculateAmount();
  }

  removeQuantity = (cartItem) => {
    this.cartItems.forEach((item, index) => {
      if (item.id === cartItem.id) {
        if (this.cartItems[index].quantity > 0) {
          this.cartItems[index].quantity -= 1;
        }
      }
   });
    this.calculateAmount();
  }

  calculateAmount = () => {
    this.totalAmount = 0;
    this.cartItems.map((item) => {
      this.totalAmount = this.totalAmount + (item.quantity * item.price);
    });
  }

  openPaymentMethod = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'It\'s just a sample confirmation message!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, pay bill!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successfull!',
          text: 'It\'s just a sample success message. We can integrate real time UPI service!',
          showConfirmButton: true,
          confirmButtonColor: '#9c27b0'
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnInit(): void {
    this.scrollTop();
    this.hotelService.getHotelsList().subscribe((data) => {
      this.hotels = data;
      this.route.paramMap.subscribe((params: ParamMap) => {
        [this.hotel] =  this.getHotel(parseInt(params.get('id'), 10));
      });
    });

    this.userName = this.hotelService.userName;
    this.cartItems = this.hotelService.cartItems;
    this.calculateAmount();

    if (!this.userName) {
      this.router.navigateByUrl('/hotels');
    }
  }
}
