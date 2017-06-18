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

#include "panelpicturepreview.h"
#include "ui_panelpicturepreview.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPicturePreview::PanelPicturePreview(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPicturePreview)
{
    ui->setupUi(this);
    ui->widgetListIDs->showButtonMax(false);

    connect(ui->checkBoxContent, SIGNAL(toggled(bool)),
            this, SLOT(showAvailableContent(bool)));
}

PanelPicturePreview::~PanelPicturePreview()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPicturePreview::showAvailableContent(bool b){
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
}
