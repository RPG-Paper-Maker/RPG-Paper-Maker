/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static T * get();
    static void kill();

protected:
    static T * element;

private:
    T & operator= (const T&) {}
};

template <class T> T* Singleton<T>::element = nullptr;

template <class T>  T* Singleton<T>::get() {
    if (element == nullptr) {
        element = new T();
    }
    return element;
}

template <class T> void Singleton<T>::kill() {
    delete element;
    element = nullptr;
}

#endif // SINGLETON_H
