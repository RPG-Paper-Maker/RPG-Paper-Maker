/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
