/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
