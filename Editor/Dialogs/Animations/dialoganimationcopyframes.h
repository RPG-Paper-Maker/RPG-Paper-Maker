/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGANIMATIONCOPYFRAMES_H
#define DIALOGANIMATIONCOPYFRAMES_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogAnimationCopyFrames
//
//  A dialog used for copying frames in animations.
//
// -------------------------------------------------------

namespace Ui {
class DialogAnimationCopyFrames;
}

class DialogAnimationCopyFrames : public QDialog
{
    Q_OBJECT

public:
    explicit DialogAnimationCopyFrames(QWidget *parent = nullptr);
    ~DialogAnimationCopyFrames();

    int from() const;
    int to() const;
    int paste() const;

private:
    Ui::DialogAnimationCopyFrames *ui;
};

#endif // DIALOGANIMATIONCOPYFRAMES_H
