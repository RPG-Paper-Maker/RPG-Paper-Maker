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

#include "autotiles.h"

QHash<QString, int> Autotiles::initializeAutotileBorder() {
    QHash<QString, int> hash;

    hash.insert("A1", 2);
    hash.insert("B1", 3);
    hash.insert("C1", 6);
    hash.insert("D1", 7);
    hash.insert("A2", 8);
    hash.insert("B4", 9);
    hash.insert("A4", 10);
    hash.insert("B2", 11);
    hash.insert("C5", 12);
    hash.insert("D3", 13);
    hash.insert("C3", 14);
    hash.insert("D5", 15);
    hash.insert("A5", 16);
    hash.insert("B3", 17);
    hash.insert("A3", 18);
    hash.insert("B5", 19);
    hash.insert("C2", 20);
    hash.insert("D4", 21);
    hash.insert("C4", 22);
    hash.insert("D2", 23);

    return hash;
}

QHash<QString, int> Autotiles::autotileBorder = initializeAutotileBorder();
const int Autotiles::COUNT_LIST = 5;
QString Autotiles::listA[COUNT_LIST] {"A1", "A2", "A3", "A4", "A5"};
QString Autotiles::listB[COUNT_LIST] {"B1", "B2", "B3", "B4", "B5"};
QString Autotiles::listC[COUNT_LIST] {"C1", "C2", "C3", "C4", "C5"};
QString Autotiles::listD[COUNT_LIST] {"D1", "D2", "D3", "D4", "D5"};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Autotiles::Autotiles()
{

}
