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

#include "widgetreleasenotes.h"
#include <QPainter>
#include <QJsonObject>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetReleaseNotes::WidgetReleaseNotes(QWidget *parent) :
    QWidget(parent)
{
    m_staticText.setTextFormat(Qt::RichText);
}

WidgetReleaseNotes::~WidgetReleaseNotes()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetReleaseNotes::updateText(QJsonArray& versions) {
    QString text;
    text += "<h1>Releases notes</h1>";

    QJsonObject objVersion;
    QJsonArray tabFeatures, tabBugs;
    for (int i = versions.size() - 1; i >= 0; i--) {
        objVersion = versions.at(i).toObject();
        text += "<h2>" + objVersion["v"].toString() + "</h2>";
        tabFeatures = objVersion["features"].toArray();
        text += "<h3>New features:</h3>";
        addItems(tabFeatures, text);
        text += "<h3>Bugs corrections:</h3>";
        tabBugs = objVersion["bugs"].toArray();
        addItems(tabBugs, text);
    }

    text += "<p></p>";

    m_staticText.setText(text);
    QSizeF size = m_staticText.size();
    setFixedSize(size.width() + 10, size.height() + 10);
}

// -------------------------------------------------------

void WidgetReleaseNotes::addItems(QJsonArray& list, QString& text) {
    text += "<ul>";
    for (int i = 0; i < list.size(); i++)
        text += "<li>+ " + list.at(i).toString() + "</li>";
    text += "</ul>";
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetReleaseNotes::paintEvent(QPaintEvent *) {
    QPainter painter(this);

    painter.drawStaticText(10, 10, m_staticText);
}
