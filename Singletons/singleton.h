/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SINGLETON_H
#define SINGLETON_H

// -------------------------------------------------------
//
//  CLASS Singleton
//
//  A singleton class.
//
// -------------------------------------------------------

template <class T> class Singleton
{
public:
    static T* get();
    static void kill();

protected:
    static T* element;

private:
    T& operator= (const T&){}
};

template <class T> T* Singleton<T>::element = nullptr;

template <class T>  T* Singleton<T>::get(){
    if (element == nullptr)
        element = new T();
    return element;
}

template <class T> void Singleton<T>::kill()
{
    delete element;
    element = nullptr;
}

#endif // SINGLETON_H
