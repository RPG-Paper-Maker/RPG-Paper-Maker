/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoganimationcopyframes.h"
#include "ui_dialoganimationcopyframes.h"
#include "systemanimationframe.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogAnimationCopyFrames::DialogAnimationCopyFrames(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogAnimationCopyFrames)
{
    ui->setupUi(this);
}

DialogAnimationCopyFrames::~DialogAnimationCopyFrames() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogAnimationCopyFrames::copyFrames(SystemAnimation *animation) {
    SystemAnimationFrame *frameCopy, *framePaste;
    int i, offset, from, to;

    offset = ui->spinBoxPaste->value();
    from = ui->spinBoxFrom->value();
    to = ui->spinBoxTo->value();
    for (i = from; i <= to; i++) {
        frameCopy = reinterpret_cast<SystemAnimationFrame *>(SuperListItem
            ::getById(animation->framesModel()->invisibleRootItem(), i,
            false));
        if (frameCopy != nullptr) {
            framePaste = reinterpret_cast<SystemAnimationFrame *>(
                SuperListItem::getById(animation->framesModel()
                ->invisibleRootItem(), i - from + offset, false));
            if (framePaste != nullptr) {
                framePaste->setCopy(*frameCopy);
            }
        }
    }
}
