/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGLOCATION_H
#define DIALOGLOCATION_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogLocation
//
//  A dialog used for setting a location path.
//
// -------------------------------------------------------

namespace Ui {
class DialogLocation;
}

class DialogLocation : public QDialog
{
    Q_OBJECT

public:
    explicit DialogLocation(QString location, QWidget *parent = 0);
    ~DialogLocation();
    QString location() const;

private:
    Ui::DialogLocation *ui;

private slots:
    void on_pushButton_clicked();
};

#endif // DIALOGLOCATION_H
